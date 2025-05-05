import { useEffect, useState } from "react";
import axios from "axios";

const GroceryList = () => {
    const [groceryItems, setGroceryItems] = useState([]);
    const [newGroceryItem, setNewGroceryItem] = useState({ name: "", quantity: 0, price: 0.00 });
    const [editGroceryItem, setEditGroceryItem] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8000/groceryitems/");
            setGroceryItems(response.data);
        } catch (error) {
            console.error("Error in the get method", error);
        }
    };

    const handleCreate = async () => {
        try {
            const response = await axios.post("http://localhost:8000/groceryitems/", newGroceryItem);
            setGroceryItems([...groceryItems, response.data]);
            setNewGroceryItem({ name: "", quantity: 0, price: 0.00 });
        } catch (error) {
            console.error("Error creating grocery item", error);
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:8000/groceryitems/${editGroceryItem.id}/`, editGroceryItem);
            setGroceryItems(groceryItems.map((item) => (item.id === editGroceryItem.id ? response.data : item)));
            setEditGroceryItem(null);
        } catch (error) {
            console.error("Error updating grocery item", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/groceryitems/${id}/`);
            setGroceryItems(groceryItems.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Error deleting grocery item", error);
        }
    };

    return (
        <div className="container my-5">
            <div className="card shadow p-4">
                <h2 className="text-center text-success mb-4">Grocery List</h2>

                <div className="row mb-3">
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={newGroceryItem.name}
                            onChange={(e) => setNewGroceryItem({ ...newGroceryItem, name: e.target.value })}
                        />
                    </div>
                    <div className="col">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Quantity"
                            value={newGroceryItem.quantity}
                            onChange={(e) => setNewGroceryItem({ ...newGroceryItem, quantity: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="col">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Price"
                            value={newGroceryItem.price}
                            onChange={(e) => setNewGroceryItem({ ...newGroceryItem, price: parseFloat(e.target.value) })}
                        />
                    </div>
                </div>

                <button className="btn btn-success w-100 mb-4" onClick={handleCreate}>
                    Add Item
                </button>

                <ul className="list-group">
                    {groceryItems.map((item) => (
                        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{item.name}</strong> - Qty: {item.quantity} - ₹{item.price}
                            </div>
                            <div>
                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setEditGroceryItem(item)}>Edit</button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>

                {editGroceryItem && (
                    <div className="mt-5 border-top pt-4">
                        <h4>Edit Item</h4>
                        <div className="row mb-3">
                            <div className="col">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editGroceryItem.name}
                                    onChange={(e) => setEditGroceryItem({ ...editGroceryItem, name: e.target.value })}
                                />
                            </div>
                            <div className="col">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={editGroceryItem.quantity}
                                    onChange={(e) => setEditGroceryItem({ ...editGroceryItem, quantity: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="col">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={editGroceryItem.price}
                                    onChange={(e) => setEditGroceryItem({ ...editGroceryItem, price: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>
                        <button className="btn btn-primary w-100" onClick={handleUpdate}>
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroceryList;
