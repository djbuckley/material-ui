import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import autoPrefix from '../utils/autoPrefix';
import transitions from '../styles/transitions';

class ScaleInChild extends Component {
  static propTypes = {
    id: PropTypes.string,
    children: PropTypes.node,
    enterDelay: PropTypes.number,
    maxScale: PropTypes.number,
    minScale: PropTypes.number,
    style: PropTypes.object,
  };

  static defaultProps = {
    enterDelay: 0,
    maxScale: 1,
    minScale: 0,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const uniqueId = `${this.constructor.name}-${Math.floor(Math.random() * 0xFFFF)}`;
    this.uniqueId = uniqueId.replace(/[^A-Za-z0-9-]/gi, '');
  }

  componentWillUnmount() {
    clearTimeout(this.enterTimer);
    clearTimeout(this.leaveTimer);
  }

  componentWillAppear(callback) {
    this.initializeAnimation(callback);
  }

  componentWillEnter(callback) {
    this.initializeAnimation(callback);
  }

  componentDidAppear() {
    this.animate();
  }

  componentDidEnter() {
    this.animate();
  }

  componentWillLeave(callback) {
    const style = ReactDOM.findDOMNode(this).style;

    style.opacity = '0';
    autoPrefix.set(style, 'transform', `scale(${this.props.minScale})`);

    this.leaveTimer = setTimeout(callback, 450);
  }

  animate() {
    const style = ReactDOM.findDOMNode(this).style;

    style.opacity = '1';
    autoPrefix.set(style, 'transform', `scale(${this.props.maxScale})`);
  }

  initializeAnimation(callback) {
    const style = ReactDOM.findDOMNode(this).style;

    style.opacity = '0';
    autoPrefix.set(style, 'transform', 'scale(0)');

    this.enterTimer = setTimeout(callback, this.props.enterDelay);
  }

  render() {
    const {
      id,
      children,
      enterDelay, // eslint-disable-line no-unused-vars
      maxScale, // eslint-disable-line no-unused-vars
      minScale, // eslint-disable-line no-unused-vars
      style,
      ...other
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;
    const baseId = id || this.uniqueId;

    const mergedRootStyles = Object.assign({}, {
      position: 'absolute',
      height: '100%',
      width: '100%',
      top: 0,
      left: 0,
      transition: transitions.easeOut(null, ['transform', 'opacity']),
    }, style);

    return (
      <div id={baseId} {...other} style={prepareStyles(mergedRootStyles)}>
        {children}
      </div>
    );
  }
}

export default ScaleInChild;
