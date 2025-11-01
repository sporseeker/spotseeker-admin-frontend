import React from 'react'
import DataTable from 'react-data-table-component'
import PropTypes from 'prop-types'
import './data-table.scss'

const CustomDataTable = ({
  columns,
  data,
  pagination = true,
  progressPending = false,
  progressComponent,
  subHeader = false,
  subHeaderComponent,
  customStyles = {},
  ...rest
}) => {
  const defaultStyles = {
    rows: {
      style: {
        minHeight: '61px',
        fontFamily: 'Roboto Condensed, sans-serif'
      }
    },
    headRow: {
      style: {
        fontFamily: 'Roboto Condensed, sans-serif',
        minHeight: '42px',
        backgroundColor: '#F3F2F7'
      }
    },
    headCells: {
      style: {
        fontFamily: 'Roboto Condensed, sans-serif',
        color: '#6A6775',
        fontSize: '16px',
        textTransform: 'uppercase',
        fontWeight: '500'
      }
    },
    cells: {
      style: {
        fontFamily: 'Roboto Condensed, sans-serif',
        color: '#959595',
        fontSize: '16px',
        fontWeight: 'normal'
      }
    },
    pagination: {
      style: {
        fontFamily: 'Roboto Condensed, sans-serif',
        color: '#959595',
        fontSize: '16px',
        fontWeight: 'normal'
      }
    },
    paginationPerPage: {
      style: {
        fontFamily: 'Roboto Condensed, sans-serif',
        color: '#959595',
        fontSize: '16px',
        fontWeight: 'normal'
      }
    },
    paginationPerPageOption: {
      style: {
        fontFamily: 'Roboto Condensed, sans-serif',
        color: '#959595',
        fontSize: '16px',
        fontWeight: 'normal'
      }
    },
    paginationSelect: {
      style: {
        fontFamily: 'Roboto Condensed, sans-serif',
        color: '#959595',
        fontSize: '16px',
        fontWeight: 'normal'
      }
    },
    menu: {
      style: {
        fontFamily: 'Roboto Condensed, sans-serif',
        color: '#959595',
        fontSize: '16px',
        fontWeight: 'normal'
      }
    },
    menuList: {
      style: {
        fontFamily: 'Roboto Condensed, sans-serif',
        color: '#959595',
        fontSize: '16px',
        fontWeight: 'normal'
      }
    },
    menuOption: {
      style: {
        fontFamily: 'Roboto Condensed, sans-serif',
        color: '#959595',
        fontSize: '16px',
        fontWeight: 'normal'
      }
    },
    ...customStyles
  }

  return (
    <div className="react-dataTable">
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        progressPending={progressPending}
        progressComponent={progressComponent}
        subHeader={subHeader}
        subHeaderComponent={subHeaderComponent}
        customStyles={defaultStyles}
        {...rest}
      />
    </div>
  )
}

CustomDataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  pagination: PropTypes.bool,
  progressPending: PropTypes.bool,
  progressComponent: PropTypes.node,
  subHeader: PropTypes.bool,
  subHeaderComponent: PropTypes.node,
  customStyles: PropTypes.object
}

export default CustomDataTable