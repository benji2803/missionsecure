export default function ContactUs() {
  return (
    <section style={{ padding: 16, maxWidth: 720 }}>
      <h2 style={{ marginTop: 0 }}>Contact Us</h2>
      <form
        onSubmit={(e) => { e.preventDefault(); alert("Thanks! We received your message."); }}
        style={{ display: "grid", gap: 12 }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span>Name</span>
          <input required name="name" style={inputStyle} />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input required type="email" name="email" style={inputStyle} />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Message</span>
          <textarea required name="message" rows={5} style={{ ...inputStyle, resize: "vertical" }} />
        </label>
        <button type="submit" style={btnStyle}>Send</button>
      </form>
    </section>
  );
}
const inputStyle = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,.15)",
  background: "rgba(255,255,255,.05)",
  color: "white"
};
const btnStyle = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,.15)",
  background: "linear-gradient(180deg,#1f2a44,#18233a)",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
  width: "fit-content"
};
