export default function ContactUs() {
  return (
    <section className="container" style={{ maxWidth: 760 }}>
      <h2>Contact Us</h2>
      <p className="muted">Questions or feedback? Send us a message.</p>

      <form
        onSubmit={(e) => { e.preventDefault(); alert("Thanks! We received your message."); }}
        style={{ display: "grid", gap: 12, marginTop: 8 }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span>Name</span>
          <input required name="name" />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input required type="email" name="email" />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Message</span>
          <textarea required name="message" rows={5} style={{ resize: "vertical" }} />
        </label>

        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </section>
  );
}
