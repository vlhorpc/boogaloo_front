import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Button extends Component {
  static propTypes = {
    text: PropTypes.string,
    iconRight: PropTypes.string,
    iconLeft: PropTypes.string,
    buttonStyleType: PropTypes.string,
    className: PropTypes.string,
    submitButton: PropTypes.bool
  };

  static defaultProps = {
    text: '',
    iconRight: '',
    iconLeft: '',
    className: '',
    buttonStyleType: 'default-button',
    submitButton: false
  };

  render() {
    const { text, iconRight, iconLeft, buttonStyleType, submitButton, className } = this.props;

    const customProps = {};
    if (submitButton) {
      customProps.type = "submit"
    }

    require('./Button.scss');
    return (
      <button
        className={`button-container ${buttonStyleType} ${className}`}
        {...customProps}
      >
        {iconLeft
          ? (
            <div className="button-icon left-icon">
              <i className={`fa ${iconLeft}`} />
            </div>
          ) : ''
        }
        <div className="text">
          {text}
        </div>
        {iconRight
          ? (
            <div className="button-icon right-icon">
              <i className={`fa ${iconRight}`} />
            </div>
          ) : ''
        }
      </button>
    );
  }
}
