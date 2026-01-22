import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "project_request" | "ticket" | "contact";
  data: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
    projectName?: string;
    projectType?: string;
    budget?: string;
    timeline?: string;
    priority?: string;
    clientId?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { type, data }: NotificationRequest = await req.json();

    let subject = "";
    let htmlContent = "";

    switch (type) {
      case "project_request":
        subject = `🚀 New Project Request: ${data.projectName || "Untitled"}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">New Project Request</h1>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Project Name:</strong> ${data.projectName || "N/A"}</p>
              <p><strong>Project Type:</strong> ${data.projectType || "N/A"}</p>
              <p><strong>Budget:</strong> ${data.budget || "N/A"}</p>
              <p><strong>Timeline:</strong> ${data.timeline || "N/A"}</p>
              <p><strong>From:</strong> ${data.name || "N/A"} (${data.email || "N/A"})</p>
            </div>
            <p style="color: #666; font-size: 14px;">Log in to the admin dashboard to review this request.</p>
          </div>
        `;
        break;

      case "ticket":
        subject = `🎫 New Support Ticket: ${data.subject || "No Subject"}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">New Support Ticket</h1>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Subject:</strong> ${data.subject || "N/A"}</p>
              <p><strong>Priority:</strong> <span style="color: ${data.priority === 'critical' ? '#dc2626' : data.priority === 'high' ? '#ea580c' : '#666'};">${data.priority || "medium"}</span></p>
              <p><strong>Message:</strong></p>
              <p style="background: #fff; padding: 15px; border-radius: 4px; border-left: 3px solid #333;">${data.message || "N/A"}</p>
              <p><strong>Client ID:</strong> ${data.clientId || "N/A"}</p>
            </div>
            <p style="color: #666; font-size: 14px;">Log in to the admin dashboard to respond to this ticket.</p>
          </div>
        `;
        break;

      case "contact":
        subject = `📧 New Contact Message from ${data.name || "Unknown"}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">New Contact Message</h1>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>From:</strong> ${data.name || "N/A"}</p>
              <p><strong>Email:</strong> ${data.email || "N/A"}</p>
              <p><strong>Subject:</strong> ${data.subject || "N/A"}</p>
              <p><strong>Message:</strong></p>
              <p style="background: #fff; padding: 15px; border-radius: 4px; border-left: 3px solid #333;">${data.message || "N/A"}</p>
            </div>
            <p style="color: #666; font-size: 14px;">Reply directly to this email to respond to the sender.</p>
          </div>
        `;
        break;

      default:
        throw new Error("Invalid notification type");
    }

    // Send email using Resend API directly
    const adminEmail = "admin@example.com"; // Replace with actual admin email
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Redlix Tracker <onboarding@resend.dev>",
        to: [adminEmail],
        reply_to: data.email,
        subject: subject,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend API error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const emailResponse = await res.json();
    console.log("Admin notification email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-admin-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
