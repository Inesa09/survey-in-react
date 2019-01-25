import React from 'react';
import 'pretty-checkbox/dist/pretty-checkbox.min.css'

const Checkbox = ({ question, handleCheck, checked }) => {

    const getInput = (checked) => {
        if(checked)
            return <input type="checkbox" name='box' value={true} onChange={handleCheck} checked/>
        return <input type="checkbox" name='box' value={true} onChange={handleCheck} />
    }

    return (
        <div class="pretty p-default p-curve p-thick p-smooth p-bigger">
            {getInput(checked)}
            <div class="state p-primary-o">
                <label> {question} </label>
            </div>
        </div>
    )
}

export default Checkbox;