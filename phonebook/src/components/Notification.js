const Notification = ({ message, type = "add" }) => {
    if (message === null) {
        return null
    } else if (type === "error") {
        return (
            <div className="error">
                {message}
            </div>
        )
    } else {
        return (
            <div className="add">
                {message}
            </div>
        )
    }
}

export default Notification