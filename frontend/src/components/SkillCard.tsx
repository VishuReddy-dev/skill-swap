import "./SkillCard.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function SkillCard(props: any) {
  const navigate = useNavigate();
  return (
    <div className="card" onClick={() => navigate(`/skills/${props.id}`)}>
      <img
        src={`http://localhost:5000/${props.image}`}
        alt="skill image"
        className="card-img-top"
      />
      <div className="card-body">
        <h5 className="card-title">{props.title}</h5>
        <p className="card-text">
          {props.description.length > 30
            ? `${props.description.slice(0, 30)}...`
            : props.description}
        </p>
        {/* <Link to={`/skills/${props.id}`} className="btn btn-primary">
          Know More
        </Link> */}
      </div>
    </div>
  );
}
