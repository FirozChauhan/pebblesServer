import React from "react";

interface ResumeData {
  name: string;
  title: string;
  contact: {
    phone: string;
    email: string;
    linkedin: string;
  };
  summary: string;
  skills: Record<string, string[]>;
  experience: Array<{
    role: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string;
    tools_used: string[] | null;
    bullets: string[] | null;
  }>;
  projects: Array<{
    name: string;
    tech_stack: string[] | null;
    start_date: string;
    end_date: string;
    bullets: string[] | null;
  }>;
  awards_certifications: Array<{
    title: string;
    issuer_or_context: string;
    year: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    graduation_year: string;
    score?: string;
  }>;
}

const ResumePDF: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <html>
      <head>
        <style>
          {`
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Libre+Baskerville:ital,wght@0,400..700;1,400..700&family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            body {
  font-family: "Lora", serif;

font-weight: 400 !important;
              font-size: 13px;
              line-height: 1.2;
              color: #000;
              margin: 15px 50px;
              max-width: 850px;
              background: white;
            }
            /* Header */
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .name {
              font-size: 28px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0px;
margin-bottom: 2px;
  font-family: "Cinzel", serif;

            }
            .title {
              font-size: 18px;
              font-weight: bold;
              margin: 0 0 5px 0;
            }
            .contact-row {
              display: flex;
              justify-content: center;
              gap: 20px;
              font-size: 12px;
              flex-wrap: wrap;
            }
            .contact-item {
              display: flex;
              align-items: center;
              gap: 5px;
            }
            .contact-icon {
              font-weight: bold;
              font-size: 13px;
            }
            /* Sections */
            .section {
margin-top: 15px !important;
            }


            .section-title {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 0px;
              letter-spacing: 0px;
  font-family: "Libre Baskerville", serif !important;
font-weight: 700 !important;

            }
            .section-divider-small {
              border: none;
              border-top: 1px solid #000;
              margin: 0px 0 8px 0;
            }
            /* Skills */
            .skills-line {
              margin-bottom: 3px;
            }
            .skills-label {
              font-weight: bold;
            }
            /* Experience / Projects */
            .item {
              margin-bottom: 10px;
            }
            .item-header {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              font-size: 13px;
            }
            .item-sub {
              display: flex;
              justify-content: space-between;
              font-style: italic;
              font-size: 12px;
              margin-top: 1px;
            }
            .item-sub-left {
              font-style: italic;
            }
            .item-sub-right {
              font-style: italic;
            }
            .bullets {
              margin: 4px 0 0 20px;
              padding: 0;
            }
            .bullets li {
              margin-bottom: 2px;
            }
            /* Awards */
            .award-item {
              margin-bottom: 4px;
            }
            .award-title {
              font-weight: bold;
            }
            .award-issuer {
              font-style: italic;
            }
            /* Education */
            .education-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 2px;
            }
            .education-degree {
              font-weight: bold;
            }
            .education-institution {
              font-style: italic;
            }
            .education-score {
              text-align: right;
            }
            .education-score-label {
              font-style: italic;
            }

  .normal {
  color: black !important;
text-decoration: none;
}

            
          `}
        </style>
      </head>
      <body>
        {/* Header */}
        <div className="header">
          <h1 className="name">{data.name}</h1>
          <p className="title">{data.title}</p>
          <div className="contact-row">
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span>{data.contact.phone}</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <span>{data.contact.email}</span>
            </div>
            <div className="contact-item">
              <span className="contact-item">🔗</span>
              <a
                href={`https://${data.contact.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
              className="normal"
              >
                {data.contact.linkedin}
              </a>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="section">
          <div className="section-title">Summary</div>
          <hr className="section-divider-small" />
          <p style={{ margin: 0, textAlign: "justify" }}>{data.summary}</p>
        </div>

        {/* Skills */}
        <div className="section">
          <div className="section-title">Skills</div>
          <hr className="section-divider-small" />
          {Object.entries(data.skills).map(([category, skills]) => (
            <div key={category} className="skills-line">
              <span className="skills-label">{category}:</span>
              <span> {skills.join(", ")}</span>
            </div>
          ))}
        </div>

        {/* Experience */}
        <div className="section">
          <div className="section-title">Experience</div>
          <hr className="section-divider-small" />
          {data.experience.map((exp, i) => (
            <div key={i} className="item">
              <div className="item-header">
                <span>{exp.role}</span>
                <span>
                  {exp.start_date} – {exp.end_date}
                </span>
              </div>
              <div className="item-sub">
                <span className="item-sub-left">
                  {exp.company} ({exp.location})
                </span>
                {exp.tools_used && exp.tools_used.length > 0 && (
                  <span className="item-sub-right">
                    Tools Used: {exp.tools_used.join(", ")}
                  </span>
                )}
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="bullets">
                  {exp.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="section">
          <div className="section-title">Projects</div>
          <hr className="section-divider-small" />
          {data.projects.map((proj, i) => (
            <div key={i} className="item">
              <div className="item-header">
                <span>{proj.name}</span>
                <span>
                  {proj.start_date} – {proj.end_date}
                </span>
              </div>
              {proj.tech_stack && proj.tech_stack.length > 0 && (
                <div className="item-sub" style={{ marginBottom: "4px" }}>
                  <span className="item-sub-left">
                    {proj.tech_stack.join(" | ")}
                  </span>
                </div>
              )}
              {proj.bullets && proj.bullets.length > 0 && (
                <ul className="bullets">
                  {proj.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Awards & Certifications */}
        <div className="section">
          <div className="section-title">Awards & Certifications</div>
          <hr className="section-divider-small" />
          {data.awards_certifications.map((award, i) => (
            <div key={i} className="award-item">
              <span className="award-title">{award.title}</span>
              {" – "}
              <span className="award-issuer">{award.issuer_or_context}</span>
              {" ("}
              {award.year}
              {")"}: {award.description}
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="section">
          <div className="section-title">Education</div>
          <hr className="section-divider-small" />
          {data.education.map((edu, i) => (
            <div key={i} className="education-item">
              <div>
                <span className="education-degree">{edu.degree}</span>
                <span className="education-institution">
                  , {edu.institution}
                </span>
              </div>
              <div className="education-score">
                <span>Graduated: {edu.graduation_year}</span>
                {edu.score && (
                  <span>
                    {" "}
                    <span className="education-score-label">|</span> {edu.score}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </body>
    </html>
  );
};

export default ResumePDF;
