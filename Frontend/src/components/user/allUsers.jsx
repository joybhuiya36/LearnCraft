import React, { useEffect, useState } from "react";
import axiosIntance from "../../utils/axiosInstance";
import { GrEdit } from "react-icons/gr";
import { MdDeleteForever } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { toast } from "react-toastify";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    axiosIntance.get("/user/all").then((res) => {
      setUsers(res.data.data);
    });
  }, [trigger]);

  const handleEdit = (id, editedValues) => {
    axiosIntance
      .patch("/user/edit", { id: id, ...editedValues })
      .then((res) => toast.success("Successfully User Data is Updated!"))
      .catch((err) => toast.error("Failed to Update User Data!"));
    setEditUserId(null);
    setEditedValues({});
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    setEditedValues({});
  };

  const handleSaveEdit = async (id) => {
    setUsers((prevUsers) => {
      return prevUsers.map((user) =>
        user._id === id ? { ...user, ...editedValues } : user
      );
    });

    handleEdit(id, editedValues);
  };

  const handleDelete = (id) => {
    axiosIntance
      .delete(`/user/delete/${id}`)
      .then((res) => toast.success("Successfully User is Deleted!"))
      .catch((err) => toast.error("Failed to Delete User!"));
    setTrigger(!trigger);
  };

  const handleInputChange = (field, value) => {
    setEditedValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  return (
    <div>
      <h2 className="text-[24px] font-bold mb-[10px]">All Users</h2>
      <table className="text-center mx-auto my-[2em] w-[100%]">
        <thead>
          <tr className="h-[3em]">
            <th className="border-[1px] border-solid border-[#ddd] bg-[#f2f2f2]">
              Name
            </th>
            <th className="border-[1px] border-solid border-[#ddd] bg-[#f2f2f2]">
              Email
            </th>
            <th className="border-[1px] border-solid border-[#ddd] bg-[#f2f2f2]">
              Role
            </th>
            <th className="border-[1px] border-solid border-[#ddd] bg-[#f2f2f2]">
              Address
            </th>
            <th className="border-[1px] border-solid border-[#ddd] bg-[#f2f2f2]">
              Phone
            </th>
            <th className="border-[1px] border-solid border-[#ddd] bg-[#f2f2f2]">
              Edit
            </th>
            <th className="border-[1px] border-solid border-[#ddd] bg-[#f2f2f2]">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="h-[3em]">
              <td className="border-[1px] border-solid border-[#ddd]">
                {editUserId === user._id ? (
                  <input
                    className="w-[60%] border border-solid border-gray-300 pl-1"
                    defaultValue={user.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td className="border-[1px] border-solid border-[#ddd]">
                {editUserId === user._id ? (
                  <input
                    className="w-[60%] border border-solid border-gray-300 pl-1"
                    defaultValue={user.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="border-[1px] border-solid border-[#ddd]">
                {user.role == 1
                  ? "Admin"
                  : user.role == 2
                  ? "Instructor"
                  : "Student"}
              </td>
              <td className="border-[1px] border-solid border-[#ddd]">
                {editUserId === user._id ? (
                  <input
                    className="w-[60%] border border-solid border-gray-300 pl-1"
                    defaultValue={user.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                ) : (
                  user.address
                )}
              </td>
              <td className="border-[1px] border-solid border-[#ddd]">
                {editUserId === user._id ? (
                  <input
                    className="w-[60%] border border-solid border-gray-300 pl-1"
                    defaultValue={user.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                ) : (
                  user.phone
                )}
              </td>
              <td className="border-[1px] border-solid border-[#ddd]">
                {editUserId === user._id ? (
                  <>
                    <button
                      className="cursor-pointer mr-2 hover:text-green-500"
                      onClick={() => handleSaveEdit(user._id)}
                    >
                      <FaSave />
                    </button>
                    <button
                      className="cursor-pointer hover:text-blue-500"
                      onClick={handleCancelEdit}
                    >
                      <ImCancelCircle />
                    </button>
                  </>
                ) : (
                  <button
                    className="cursor-pointer hover:text-blue-500"
                    onClick={() => setEditUserId(user._id)}
                  >
                    <GrEdit />
                  </button>
                )}
              </td>
              <td className="text-xl border-[1px] border-solid border-[#ddd]">
                <button
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => handleDelete(user._id)}
                >
                  <MdDeleteForever />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
