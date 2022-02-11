/*

Prompt:
  We have defined a basic dropdown via the Dropdown and DropdownItem components below, with example usage
  in the ExampleNav component. The Dropdown and DropdownItem components have some problems, and also 
  have room for improvements (doesn't everything?) A couple items TODO here (make sure to explain with comments!)
  
  0. How are you today? 😊
  1. Please fix any obvious issues you see with the dropdown and then save your gist.
  2. Please then make improvements to the dropdown dnd then save your gist again.
  3. Consider the different ways that this dropdown might be used and what changes would
     be neccessary to make it more flexible.
     3.1 We can define DropDownMenu component to be able to create nested DropDown
  4. If we wanted to sync the dropdown selection to a server with this hypothetial "syncing library"
     `app.sync('PATCH', 'users/'+app.USER.id, { dropdown_1_state: {true,false} })` where would this be included?
     Should the state be read again from the server to show the dropdown open/closed on page load?
     Answer :
     4.1 => Will be included in toggle method of DropDown component
     4.2 => It's not necessary to read again from the server. We can use local storage or local DB, when the page is loaded we read firstly this value
  5. If we wanted to pass children (like this example) OR a Promise that resolves to an array of items
     what changes should be made? (just a sentence or two or some code is ok).
  
  PS: No need to worry about CSS or about making it actually run.

 */

import React, { PureComponent } from 'react';

class Dropdown extends PureComponent {
  constuctor(props) {
    super(props);
    this.state = {
      isOpen: false,
      value: null // we can use default value
    };
    //we must bind 'this' to toggle method
    this.toggle = this.toggle.bind(this)
    this.onSelect = this.onSelect.bind(this)
  }

  toggle(event) {
    const { isOpen } = this.state;
    const { onClick } = this.props
    // save new state in the server
    app.sync('PATCH', 'users/' + app.USER.id, { dropdown_1_state: { isOpen: !isOpen } })
    // the new value of isOpen is the negative value of current isOpen
    this.setState({ isOpen: !isOpen });
    if (onClick) onClick(event)
  }
  onSelect(value) {
    this.setState({ value: value })
  }
  childrenWithProps() {
    const { children } = this.props
    // add some props to children
    return React.Children.map(children, child => {
      // check if the child is a valid react element
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { onSelect: onSelect });
      }
      return child;
    })
  }
  render() {
    const { isOpen } = this.state;
    const { label } = this.props;

    return (
      <div className="dropdown">
        <button type="button" className="dropdown-button" id="dropdownButton" aria-haspopup="true" aria-expended={isOpen} onClick={this.toggle}>{label}</button>
        <ul className={`${isOpen ? 'dropdown-open' : ''} dropdown-menu`} aria-labelledby="dropdownButton" role="menu">
          {childrenWithProps()}
        </ul>
      </div>
    );
  }
}

class DropdownItem extends PureComponent {
  // TODO implement me
  constuctor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }
  onClick(event) {
    const { name, children, onSelect } = this.props
    if (onSelect) {
      onSelect(name ? name : children)
    }

  }
  render() {
    const { href, children } = this.props
    return (
      <li className='dropdown-item' onClick={this.onClick}><a href={href}>{children}</a></li>
    )
  }
}

class ExampleNav extends PureComponent {
  render() {
    return (
      <nav>
        <a href="/page1">Page 1</a>
        <Dropdown label="More items">
          <DropdownItem href="/page2">Page 2</DropdownItem>
          <DropdownItem href="/page3">Page 3</DropdownItem>
          <DropdownItem href="/page4">Page 4</DropdownItem>
        </Dropdown>
        <Dropdown label="Even more items">
          <DropdownItem href="/page5">Page 5</DropdownItem>
          <DropdownItem href="/page6">Page 6</DropdownItem>
        </Dropdown>
      </nav>
    );
  }
}
