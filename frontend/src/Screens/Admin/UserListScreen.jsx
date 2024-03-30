import React from "react";
import { Button, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useGetUsersQuery, useDeleteUserMutation } from "../../slices/usersApiSlice";
import Message from "../../Components/Message";
import Loader from "../../Components/Loader";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";

function UserListScreen() {

    const { data: users, refetch, isLoading, error } = useGetUsersQuery();
    const [ deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

    const deleteHandler = async (id) => {
        if(window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(id);
                refetch();
                toast.success("User deleted successfully");
            } catch (err) {
                toast.error(err?.data?.message || err.error.message);
            }
        }
    };

    return (
        <>
            <h1>Users</h1>
            {loadingDelete && <Loader />}
            { isLoading ? ( 
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <>
                    <Table striped hover responsive className="table-sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>EMAIL</th>
                                <th>ADMIN</th>
                                <th></th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td><a href={`mailto:${user.email}`}>{user.email}</a> </td>
                                    <td>
                                        {user.isAdmin ? (
                                            <FaCheck style={{color: "green"}} />
                                        ) : (
                                            <FaTimes style={{color: "red"}} />
                                        )}
                                    </td>
                                
                                    <td>
                                        <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                            <Button variant="light" className="btn-sm mx-2">
                                                <FaEdit />
                                            </Button>
                                        </LinkContainer>
                                        <Button
                                            variant="danger" className="btn-sm" onClick={() => deleteHandler(user._id)}
                                        > <FaTrash style={{color: "white"}}/></Button>
                                    </td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </>
            )}
        </>
    )
}

export default UserListScreen;