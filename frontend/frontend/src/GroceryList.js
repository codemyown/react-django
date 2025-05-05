import { useEffect, useState } from "react";
import axios from "axios";

const GroceryList = () => {
    const [groceryItems, setGroceryItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: "", quantity: 0, price: 0.0 });
    const [editItem, setEditItem] = useState(null);

    const token = localStorage.getItem("access");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:8000/groceryitems/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGroceryItems(res.data);
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    const handleCreate = async () => {
        try {
            const res = await axios.post("http://localhost:8000/groceryitems/", newItem, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGroceryItems([...groceryItems, res.data]);
            setNewItem({ name: "", quantity: 0, price: 0.0 });
        } catch (err) {
            console.error("Error creating item", err);
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await axios.put(`http://localhost:8000/groceryitems/${editItem.id}/`, editItem, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGroceryItems(groceryItems.map((item) => (item.id === editItem.id ? res.data : item)));
            setEditItem(null);
        } catch (err) {
            console.error("Error updating item", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/groceryitems/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGroceryItems(groceryItems.filter((item) => item.id !== id));
        } catch (err) {
            console.error("Error deleting item", err);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Grocery List</h2>
            <div className="mb-3">
                <input
                    className="form-control mb-2"
                    placeholder="Name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <input
                    className="form-control mb-2"
                    type="number"
                    placeholder="Quantity"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                />
                <input
                    className="form-control mb-2"
                    type="number"
                    placeholder="Price"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                />
                <button className="btn btn-success w-100" onClick={handleCreate}>
                    Add Item
                </button>
            </div>

            {groceryItems.map((item) => (
                <div key={item.id} className="card mb-2 p-3">
                    <h5>{item.name}</h5>
                    <p>Quantity: {item.quantity} | Price: ₹{item.price}</p>
                    <button className="btn btn-warning me-2" onClick={() => setEditItem(item)}>
                        Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                        Delete
                    </button>
                </div>
            ))}

            {editItem && (
                <div className="mt-4">
                    <h4>Edit Item</h4>
                    <input
                        className="form-control mb-2"
                        value={editItem.name}
                        onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                    />
                    <input
                        className="form-control mb-2"
                        type="number"
                        value={editItem.quantity}
                        onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
                    />
                    <input
                        className="form-control mb-2"
                        type="number"
                        value={editItem.price}
                        onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                    />
                    <button className="btn btn-primary me-2" onClick={handleUpdate}>
                        Save
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditItem(null)}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default GroceryList;
