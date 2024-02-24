import React from "react";
import './details.css';

export interface DetailsProps {
    type: string;
    priority: string;
    status: string;
    resolution: string;
    description: string;
    labels: string[];
    assignee: string;
    reporter: string;
    created: string;
    updated: string;
}

export const Details: React.FC<DetailsProps> = (props) => {
    const { type, priority, status, resolution, description, labels, assignee, reporter, created, updated } = props;

    return (
        <div className="details">
            <h1 className="title">Details</h1>
            <div className="card">
                <h2>Type</h2>
                <p>{type}</p>
            
                <h2>Priority</h2>
                <p>{priority}</p>
            
                <h2>Status</h2>
                <p>{status}</p>
            
                <h2>Resolution</h2>
                <p>{resolution}</p>
                <h2>Description</h2>
                <p>{description}</p>
            
            
                <h2>Labels</h2>
                <p>{labels.join(', ')}</p>
            
            
                <h2>Assignee</h2>
                <p>{assignee}</p>
            
                <h2>Reporter</h2>
                <p>{reporter}</p>
    
                <h2>Created</h2>
                <p>{created}</p>
      
                <h2>Updated</h2>
                <p>{updated}</p>
          </div>
        </div>
    );
}