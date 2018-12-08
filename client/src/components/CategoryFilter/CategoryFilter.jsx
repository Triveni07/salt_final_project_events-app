import React, { Component } from 'react';
import propTypes from 'prop-types';
import './CategoryFilter.scss';

class CategoryFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: 'ALL',
    };

    this.executeCallback = this.executeCallback.bind(this);
  }

  executeCallback(e) {
    const { callback } = this.props;

    const category = e.target.innerText.replace(/\n/, '').trim();
    this.setState({ category });

    callback(category === 'ALL' ? '' : category);
  }

  render() {
    const { category } = this.state;
    const availableCategories = ['ALL', 'STOCKHOLM', 'PARTY', 'MUSIC', 'FAMILY', 'MAP'];

    return (
      <div className="category-filters">
        {availableCategories.map(categoryName => (
          categoryName === category
            ? (
              <button
                type="button"
                className={`btn-style btn-${categoryName}`}
                key={Math.random()}
                variant="contained"
                color="primary"
                onClick={this.executeCallback}
              >
                {categoryName}
              </button>
            )
            : (
              <button
                className="btn-style"
                type="button"
                key={Math.random()}
                onClick={this.executeCallback}
              >
                {categoryName}
              </button>
            )
        ))}
      </div>
    );
  }
}

CategoryFilter.propTypes = {
  callback: propTypes.func.isRequired,
};

export default CategoryFilter;
