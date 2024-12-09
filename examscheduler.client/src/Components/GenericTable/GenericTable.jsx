import React from "react";
import "./GenericTable.css";

const GenericTable = ({ columns, data, onEdit, onDelete }) => {
    return (
        <table className="generic-table">
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col.key}>{col.header}</th>
                    ))}
                    {(onEdit || onDelete) && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
                    <tr key={row.id}> {/* Using the id as the key */}
                        {columns.map((col) => (
                            <td key={col.key}>{row[col.key]}</td>
                        ))}
                        {(onEdit || onDelete) && (
                            <td className="controls">
                                {onEdit && (
                                    <button
                                        className="generic-management-button"
                                        onClick={() => onEdit(row)}
                                    >
                                        Edit
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        className="generic-management-button"
                                        onClick={() => onDelete(row.id)} // Pass the id for deletion
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default GenericTable;