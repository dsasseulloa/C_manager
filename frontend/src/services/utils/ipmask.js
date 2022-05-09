import MaskedInput from "@biproxi/react-text-mask";

import React from 'react'

import PropTypes from 'prop-types'

const IpMaskInput = ({ inputRef, ...other }) => {
  return <MaskedInput
    {...other}
    ref={ref => {
      inputRef(ref ? ref.inputElement : null)
    }}
    // 192.168.1.1
    mask={[/[1-2]/, /[0-9]/, /[0-9]/, '.', /[1-2]/, /[0-9]/, /[0-9]/, '.', /[1-2]/, /[0-9]/, /[0-9]/, '.', /[1-2]/, /[0-9]/, /[0-9]/]}
    // ensures that every subsection of the ip address is greater than 0 and lower than 256
    pipe={value => {
      const subips = value.split('.')
      const invalidSubips = subips.filter(ip => {
        ip = parseInt(ip) 
        return ip < 0 || ip > 255
      })
      return invalidSubips.length > 0 ? false : value
    }}
    placeholderChar={'\u2000'}
    keepCharPositions={false}
  />
}

PropTypes.propTypes = {
  inputRef: PropTypes.func.isRequired
}

export default IpMaskInput