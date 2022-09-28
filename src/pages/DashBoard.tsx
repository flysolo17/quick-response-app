interface DashBoardPageProps {}

const DashBoardPage: React.FunctionComponent<DashBoardPageProps> = () => {
  return (
    <div>
      <div className="create-subject">
        <label className="create-subject-label">CREATE SUBJECT</label>
      </div>
      <h1 className="main-page">Dashboard</h1>
    </div>
  );
};

export default DashBoardPage;
