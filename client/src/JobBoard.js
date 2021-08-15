import React, { useEffect, useState } from 'react';
import { JobList } from './JobList';
import { loadJobs } from './requests';

// export class JobBoard extends Component {

//   render() {
//     return (
//       <div>
//         <h1 className="title">Job Board</h1>
//         <JobList jobs={jobs} />
//       </div>
//     );
//   }
// }

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => loadJobs().then(jobs => setJobs(jobs)), []);

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  )
}

export default JobBoard;