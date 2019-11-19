import React, { Component } from 'react'

export default class TextInput extends Component {
    constructor(props) {
        super(props)

        this.state = {
            editing: false,
            value: props.value
        }
    }

    toggleEditing = () => this.setState(prevState => ({editing: !prevState.editing}))

    setValue = event => this.setState({value: event.target.value})

    renderInput = () => {
        return (
            <input 
                type="text" 
                autoFocus={true}
                value={this.state.value}
                onBlur={this.toggleEditing}
                onChange={this.setValue}
            />
        )
    }

    render() {
        const { editing, value } = this.state

        if (editing) {
            return this.renderInput()
        }

        return <span onClick={this.toggleEditing}>{value}</span>
    }
}