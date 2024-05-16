import './App.css';
import { useEffect, useState } from 'react';
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core';

// Indicator code use it below
const appToaster = Toaster.create({
  position: "top"
});

function App() {
  // State for showing user data
  const [users, setUsers] = useState([]);
  // State for adding new user data
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newWebsite, setNewWebsite] = useState("");

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((json) => setUsers(json))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Function for adding user data
  function addUser() {
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebsite.trim();

    if (name && email && website) {
      fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          website
        }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        }
      })
      .then((response) => response.json())
      .then(data => {
        setUsers([...users, { ...data, id: users.length + 1 }]); // Ensuring unique ID

        // The indicator message code below
        appToaster.show({
          message: "User added successfully!!!",
          intent: 'success',
          timeout: 3000
        });
        setNewName("");
        setNewEmail("");
        setNewWebsite("");
      });
    }
  }

  function onChangeHandler(id, key, value) {
    setUsers(users => {
      return users.map(user => {
        return user.id === id ? { ...user, [key]: value } : user; // Fixing the ternary operator
      });
    });
  }

  function updateUser(id) {
    const user = users.find((user) => user.id === id);

    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { // Fixed URL
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    })
    .then((response) => response.json())
    .then(data => {
      setUsers(users.map(u => u.id === id ? data : u)); // Properly updating user list

      // The indicator message code below
      appToaster.show({
        message: "User updated successfully!!!",
        intent: 'success',
        timeout: 3000
      });
    });
  }

  function deleteUser(id) {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "DELETE",
    })
    .then((response) => response.json())
    .then(data => {
      setUsers(users => users.filter(user => user.id !== id)); // Correctly updating state

      appToaster.show({
        message: "User deleted successfully!!!",
        intent: 'danger',
        timeout: 3000
      });
    });
  }

  return (
    <div className="App">
      <table className='bp4-html-table modifier'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>E-mail</th>
            <th>Website</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={user.id}>
              <td><EditableText value={user.id.toString()} /></td>
              <td><EditableText value={user.name} onChange={value => onChangeHandler(user.id, 'name', value)} /></td>
              <td><EditableText value={user.email} onChange={value => onChangeHandler(user.id, 'email', value)} /></td>
              <td><EditableText value={user.website} onChange={value => onChangeHandler(user.id, 'website', value)} /></td>
              <td>
                <Button intent='primary' onClick={() => updateUser(user.id)}>Update</Button>
                &nbsp;
                <Button intent='danger' onClick={() => deleteUser(user.id)}>Delete</Button>
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder='Enter Your Name...'
              />
            </td>
            <td>
              <InputGroup
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder='Enter Your Email...'
              />
            </td>
            <td>
              <InputGroup
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                placeholder='Enter Your Website...'
              />
            </td>
            <td>
              <Button intent='success' onClick={addUser}>Add User</Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
