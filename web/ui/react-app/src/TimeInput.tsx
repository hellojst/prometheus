import $ from 'jquery';
import React, { Component } from 'react';
import { Button, InputGroup, InputGroupAddon, Input } from 'reactstrap';

import moment from 'moment-timezone';

import 'tempusdominus-core';
import 'tempusdominus-bootstrap-4';
import '../node_modules/tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css';

import { dom, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faCalendarCheck,
  faArrowUp,
  faArrowDown,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

library.add(faCalendarCheck, faArrowUp, faArrowDown, faTimes);
// Sadly needed to also replace <i> within the date picker, since it's not a React component.
dom.watch();

interface TimeInputProps {
  time: number | null; // Timestamp in milliseconds.
  range: number; // Range in seconds.
  placeholder: string;

  onChangeTime: (time: number | null) => void;
}

class TimeInput extends Component<TimeInputProps> {
  private timeInputRef = React.createRef<HTMLInputElement>();
  private $time: any | null = null;

  getBaseTime = (): number => {
    return this.props.time || moment().valueOf();
  };

  increaseTime = (): void => {
    const time = this.getBaseTime() + (this.props.range * 1000) / 2;
    this.props.onChangeTime(time);
  };

  decreaseTime = (): void => {
    const time = this.getBaseTime() - (this.props.range * 1000) / 2;
    this.props.onChangeTime(time);
  };

  clearTime = (): void => {
    this.props.onChangeTime(null);
  };

  componentDidMount() {
    this.$time = $(this.timeInputRef.current!);

    this.$time.datetimepicker({
      icons: {
        today: 'fas fa-calendar-check',
      },
      buttons: {
        //showClear: true,
        showClose: true,
        showToday: true,
      },
      sideBySide: true,
      format: 'YYYY-MM-DD HH:mm',
      locale: 'en',
      timeZone: 'UTC',
      defaultDate: this.props.time,
    });

    this.$time.on('change.datetimepicker', (e: any) => {
      if (e.date) {
        this.props.onChangeTime(e.date.valueOf());
      }
    });
  }

  componentWillUnmount() {
    this.$time.datetimepicker('destroy');
  }

  componentDidUpdate() {
    this.$time.datetimepicker('date', this.props.time ? moment(this.props.time) : null);
  }

  render() {
    return (
      <InputGroup className="time-input" size="sm">
        <InputGroupAddon addonType="prepend">
          <Button title="Decrease time" onClick={this.decreaseTime}>
            <FontAwesomeIcon icon={faChevronLeft} fixedWidth />
          </Button>
        </InputGroupAddon>

        <Input
          placeholder={this.props.placeholder}
          innerRef={this.timeInputRef}
          onFocus={() => this.$time.datetimepicker('show')}
          onBlur={() => this.$time.datetimepicker('hide')}
          onKeyDown={e => ['Escape', 'Enter'].includes(e.key) && this.$time.datetimepicker('hide')}
        />

        {/* CAUTION: While the datetimepicker also has an option to show a 'clear' button,
            that functionality is broken, so we create an external solution instead. */}
        {this.props.time && (
          <InputGroupAddon addonType="append">
            <Button className="clear-time-btn" title="Clear time" onClick={this.clearTime}>
              <FontAwesomeIcon icon={faTimes} fixedWidth />
            </Button>
          </InputGroupAddon>
        )}

        <InputGroupAddon addonType="append">
          <Button title="Increase time" onClick={this.increaseTime}>
            <FontAwesomeIcon icon={faChevronRight} fixedWidth />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    );
  }
}

export default TimeInput;
