import AddProjectForm from "@/components/add/AddProjectForm";
import Layout from "@/components/layout/Layout";
import React from "react";

const AddProject = () => {
  return (
    <Layout>
      <div className="p-4">
        <AddProjectForm />
      </div>
    </Layout>
  );
};

export default AddProject;
