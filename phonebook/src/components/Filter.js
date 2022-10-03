const Filter = ({ newFilter, handleFilter }) => 
    <div>
        filter shown with: <input value={newFilter} onChange={handleFilter} />
    </div>
    
export default Filter