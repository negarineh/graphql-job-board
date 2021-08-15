import React, { useEffect, useState } from 'react';
import { loadCompany } from './requests';
import { JobList } from './JobList';

const CompanyDetail = (props) => {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchData = async (id) => {
      const response = await loadCompany(id);
      return setCompany(response);
    }
    fetchData(props.match.params.companyId);
  }, [props.match.params.companyId]);

  if (!company) return null;

  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h5 className="title is-5">Jobs at {company.name}</h5>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyDetail;

