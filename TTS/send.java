import javax.mail.*;
import javax.mail.internet.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;

public class SendEmailServlet extends HttpServlet {
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {
		
		// Get parameters from the HTML form
		String to = request.getParameter("to");
		String subject = request.getParameter("subject");
		String message = request.getParameter("message");
		
		// Set SMTP server properties
		Properties props = new Properties();
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "587");
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		
		// Create session object and authenticate with Gmail
		Session session = Session.getInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication("bigdalao@gmail.com", "asdf760322");
			}
		});
		
		try {
			// Create message object
			Message email = new MimeMessage(session);
			email.setFrom(new InternetAddress("yourgmailusername@gmail.com"));
			email.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
			email.setSubject(subject);
			email.setText(message);
			
			// Send email
			Transport.send(email);
			
			// Redirect to success page
			response.sendRedirect("success.html");
			
		} catch (MessagingException e) {
			throw new RuntimeException(e);
		}
	}
}