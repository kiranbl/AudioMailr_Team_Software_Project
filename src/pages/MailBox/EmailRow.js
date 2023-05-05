import React from "react";
import "./EmailRow.css";
import { Checkbox, IconButton } from "@mui/material";
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import LabelImportantOutlinedIcon from '@mui/icons-material/LabelImportantOutlined';
/* import { useHistory } from "react-router-dom"; */

function EmailRow({ id, title, subject, description, time }) {
    /*const history = useHistory(); */
    return ( 
        /* <div onClick={() => history.push("/mail")} className="emailRow"> */
        <div className="emailRow">
            <div className="emailRow_options">
                <Checkbox />
                <IconButton>
                    <StarBorderOutlinedIcon />
                </IconButton>
                <IconButton>
                    <LabelImportantOutlinedIcon />
                </IconButton>
            </div>

            <h3 className="emailRow__title">
                {title}
            </h3>

            <div className="emailRow__message">
                <h4>
                    {subject}
                <span className="emailRow__description">
                    {description}
                </span>
                </h4>
            </div>
            
            <div className="emailRow__description">
                {time}
            </div>
        </div>
    );
}
export default EmailRow; 