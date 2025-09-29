import { useState } from 'react';
import usersData from './data/users.json';

console.log('Users data loaded:', usersData);
console.log('Number of users:', usersData.length);

export default function TestUsers() {
    const [users] = useState(usersData);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Test Users Component</h1>
            <p>Users loaded: {users.length}</p>
            <div>
                {users.slice(0, 3).map(user => (
                    <div key={user.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
                        <strong>{user.fullName}</strong> - {user.email} - {user.role}
                    </div>
                ))}
            </div>
        </div>
    );
}
