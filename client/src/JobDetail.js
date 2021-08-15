import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadJob } from './requests';

const JobDetail = (props) => {
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchData = async (id) => {
      const response = await loadJob(id);
      return setJob(response);
    }
    fetchData(props.match.params.jobId);
  }, []);

  if (!job) return null;

  return (
    <div>
      <h1 className="title">{job.title}</h1>
      <h2 className="subtitle">
        <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
      </h2>
      <div className="box">{job.description}</div>
    </div>
  );
}

export default JobDetail;
