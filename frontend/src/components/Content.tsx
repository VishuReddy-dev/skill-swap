import axios from "axios";
import { useState, useEffect } from "react";
import SkillCard from "./SkillCard";
import "./Content.css";
// Define the Skill type based on your API response
interface Skill {
  _id: any;
  title: string;
  description: string;
  image: string;
}

export default function Content() {
  const [skills, setSkills] = useState<Skill[]>([]); // Explicitly type the state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/skills/")
      .then((response) => {
        setSkills(response.data); // Ensure response.data matches the Skill[] type
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching skills:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="card is-loading">
        <div className="image"></div>
        <div className="content">
          <h2></h2>
          <p></p>
        </div>
      </div>
    );
  }

  return (
    <div className="Content-wrapper">
      <div className="container">
        {skills.map((skill, index) => (
          <SkillCard
            id={skill._id}
            key={index}
            title={skill.title}
            description={skill.description}
            image={skill.image}
          />
        ))}
      </div>
    </div>
  );
}
