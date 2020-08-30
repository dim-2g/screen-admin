import React, { Fragment } from 'react';
import Row from './row';
import Head from './head';
import Pager from "react-pager";

const Table = (props) => {
    const {pagination} = props;
    return (
        <Fragment>
            <table className="table table-pages">
                <thead className="thead-light">
                    <Head />
                </thead>
                <tbody>
                {props.pages && props.pages.map(item => {
                    return (
                        <Row
                            key={item.id}
                            checkOneUrl={props.checkOneUrl}
                            deleteUrl={props.deleteUrl}
                            {...item}
                        />
                    );
                })}
                </tbody>
            </table>
            <div className="row justify-content-md-center">
            {props.loadData &&
                    <Pager
                        total={pagination.total}
                        current={pagination.currentPage - 1}
                        visiblePages={pagination.visiblePage}
                        className="pagination-sm pull-right"
                        onPageChanged={props.handlePageChanged}
                    />
            }
            </div>
        </Fragment>
    );
}

export default Table;