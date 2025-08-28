// Contact.jsx
export default function Contact(){
  return (
    <div className="container-narrow card-pane">
      <h1 className="page-title">Get in Touch</h1>
      <form className="form-grid">
        <label>Name<input type="text" placeholder="Your name" /></label>
        <label>Email<input type="email" placeholder="you@example.com" /></label>
        <label>Subject<input type="text" placeholder="Subject" /></label>
        <label className="full">Message<textarea rows="5" placeholder="Your message..." /></label>
        <button className="btn-green wide" type="submit">Send Message</button>
      </form>
    </div>
  );
}
