import React from 'react'
import { FormGroup, Label, InputGroup, InputGroupText, Input } from 'reactstrap'

const IconInput = ({
  id,
  name,
  label,
  value,
  onChange,
  icon: IconComponent,
  iconSize = 18,
  iconColor = '#6A6775',
  type = 'text',
  placeholder = '',
  readOnly = false,
  required = false,
  ...props
}) => {
  return (
    <FormGroup style={{ marginBottom: 0 }}>
      <Label
        for={id}
        style={{
          fontFamily: 'Roboto Condensed, sans-serif',
          color: '#6A6775',
          fontSize: '16px',
          fontWeight: '400'
        }}
      >
        {label}
      </Label>
      <InputGroup>
        <InputGroupText
          style={{
            width: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: '0',
            background: '#fff'
          }}
        >
          <IconComponent size={iconSize} color={iconColor} />
        </InputGroupText>
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0
          }}
          {...props}
        />
      </InputGroup>
    </FormGroup>
  )
}

export default IconInput