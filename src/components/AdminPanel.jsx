import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, searchUsers } from "@/features/adminSlice";
import UserSearch from "@/components/UserSearch";
import AddUserForm from "./AddUserForm";
import UserManagement from "./UserManagement";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AdminPanel() {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.admin.selectedUser);
  const [query, setQuery] = useState("");

  const handleUserSelect = (user) => {
    dispatch(setSelectedUser(user));
  };

  const handleRefresh = () => {
    dispatch(setSelectedUser(null));
    dispatch(searchUsers(query));
  };

  return (
    <div className="p-6 bg-background text-foreground rounded-lg shadow-lg max-w-4xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">🛠 Admin Panel</h2>

      <Tabs defaultValue="manage" className="w-full bg-background">
        <TabsList className="w-full mb-6 flex space-x-2 justify-center bg-background p-2 rounded-lg">
          <TabsTrigger
            value="add"
            className="w-1/2 text-center px-4 py-2 rounded transition bg-muted text-foreground data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            ➕ Add New User
          </TabsTrigger>
          <TabsTrigger
            value="manage"
            className="w-1/2 text-center px-4 py-2 rounded transition bg-muted text-foreground data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            🧑‍💻 Manage Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="flex justify-center">
          <AddUserForm />
        </TabsContent>

        <TabsContent value="manage" className="flex justify-center">
          <div className="w-full max-w-md space-y-6">
            <UserSearch onSelectUser={handleUserSelect} setQuery={setQuery} />
            {selectedUser && (
              <UserManagement
                user={selectedUser}
                onUserChange={handleRefresh}
                onUpdate={(updatedUser) => {
                  dispatch(setSelectedUser(updatedUser));
                }}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
