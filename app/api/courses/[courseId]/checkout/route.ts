import Stripe from "stripe";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

interface Param {
  params: { courseId: string };
}

export async function POST(req: Request, { params }: Param) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorised user", { status: 401 });
    }

    const course = await prisma.courses.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    const purchase = await prisma.purchase.findUnique({
      where: {
        userId: user.id,
        courseId: params.courseId,
      },
    });

    if (purchase) return new NextResponse("Already purchased", { status: 400 });
    if (!course) return new NextResponse("No course found", { status: 404 });

    let stripeCustomer = await prisma.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem = {
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: course.title,
          description: course.description!,
        },
        unit_amount: Math.round(course.price! * 100),
      },
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(course.price! * 100),
      currency: "USD",
      description: course.description!,
      shipping: {
        name: user?.firstName! + " " + user?.lastName,
        address: {
          city: "Mumbai",
          postal_code: "421204",
          state: "Maharastra",
          country: "India",
        },
      },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
        name: user?.firstName! + " " + user?.lastName,
        address: {
          city: "Mumbai",
          postal_code: "421204",
          state: "Maharastra",
          country: "India",
        },
      });

      stripeCustomer = await prisma.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items: [line_items],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?cancelled=1`,
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
    });

    return NextResponse.json({
      url: session.url,
      paymentStatus: paymentIntent.status,
    });
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
