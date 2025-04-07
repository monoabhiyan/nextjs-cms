import {Children} from "@/lib/types";

const AdminPanelXSpacer = ({children}: Children) => {
  return (
    <div className="px-4 lg:px-6">
      {children}
    </div>
  );
};

export default AdminPanelXSpacer;
