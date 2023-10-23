import { useState } from "react";
import { useLoggedInUser } from "../LoggedInUserContext/LoggedInUserContext";
const greyStarIcon = require("../../assets/greystar.png");
const starIcon = require('../../assets/star.png');
export default function StarInfo(){
    const { loggedInUser, setLoggedInUser } = useLoggedInUser();
    const {entityIsStarred, setEntityIsStarred} = useState(false);
    return (
           <div className="star-info">
            {loggedInUser && <img
              src={entityIsStarred ? greyStarIcon : starIcon}
              className="star-icon"
              alt="Star"
              onClick={!entityIsStarred ? () => handleStarPost(post._id) : () => handleUnstarPost(post._id)}
            />}
            <span className="num-stars">{numStars} star{numStars !== 1 ? "s" : ""}</span>
          </div>
    )
}