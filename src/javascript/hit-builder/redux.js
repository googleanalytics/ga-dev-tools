import { connect, Provider } from 'react-redux'
import { createStore, combineReducers, bindActionCreators } from 'redux'


var uniqueId = 1;
function newCounter() {
  return {
    id: uniqueId++,
    value: 0
  }
}

function counters(state = [], action) {
  switch (action.type) {
    case 'INCREMENT':
      return state.map((counter) => {
        if (counter.id !== action.id) {
          return counter;
        }
        else {
          return {
            ...counter,
            value:  counter.value + 1
          }
        }
      });
    case 'DECREMENT':
      return state.map((counter) => {
        if (counter.id !== action.id) {
          return counter;
        }
        else {
          return {
            ...counter,
            value:  counter.value - 1
          }
        }
      });
    case 'ADD_COUNTER':
      return [
        ...state,
        newCounter()
      ];
    default:
      return state;
  }
}


let countersApp = combineReducers({counters})


let store = createStore(countersApp);


function Counter({counters, onIncrement, onDecrement, onAdd}) {
  return (
    <div>
      {counters.map((counter) => {
        return (
          <div key={counter.id}>
            <h1>{counter.value}</h1>
            <button onClick={() => onIncrement(counter)}>+</button>
            <button onClick={() => onDecrement(counter)}>-</button>
          </div>
        )
      })}
      <button onClick={onAdd}>Add counter</button>
    </div>
  );
}


function mapStateToProps(state) {
  return {
    counters: state.counters
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onIncrement: ({id}) => dispatch({type: 'INCREMENT', id}),
    onDecrement: ({id}) => dispatch({type: 'DECREMENT', id}),
    onAdd: () => dispatch({type: 'ADD_COUNTER'})
  }
}

const CounterApp = connect(mapStateToProps, mapDispatchToProps)(Counter);

function render2() {
  ReactDOM.render(
    <Provider store={store}>
      <CounterApp />
    </Provider>,
    document.getElementById('root')
  )
}

store.subscribe(render2)
render2()
