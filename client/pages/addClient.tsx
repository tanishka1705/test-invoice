import AddClientForm from "@/components/add/AddClientForm";
import Layout from "@/components/layout/Layout";

const AddClient = () => {
  return (
    <Layout>
      <div className="p-4">
        <AddClientForm />
      </div>
    </Layout>
  );
};

export default AddClient;
