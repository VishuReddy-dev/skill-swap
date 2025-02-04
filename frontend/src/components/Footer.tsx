const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-md-4">
            <h5>About SkillSwap</h5>
            <p>
              SkillSwap is a platform where individuals can share and learn
              skills from each other. Connect, grow, and exchange knowledge
              effortlessly.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-white text-decoration-none">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-white text-decoration-none">
                  About
                </a>
              </li>
              <li>
                <a href="/skills" className="text-white text-decoration-none">
                  Skills
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white text-decoration-none">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="col-md-4">
            <h5>Follow Us</h5>
            <div>
              <a
                href="https://www.linkedin.com/in/vishwanath-reddy-780947256/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white me-3 text-decoration-none"
              >
                <i className="bi bi-linkedin"></i> LinkedIn
              </a>
              <a
                href="https://x.com/Vishwanath77687"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white me-3 text-decoration-none"
              >
                <i className="bi bi-twitter"></i> Twitter
              </a>
              <a
                href="https://www.instagram.com/vishu_vishwanath_reddy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-decoration-none"
              >
                <i className="bi bi-instagram"></i> Instagram
              </a>
            </div>
          </div>
        </div>
        <hr className="bg-light my-3" />
        <div className="text-center">
          <p className="mb-0">&copy; 2024 SkillSwap. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
