const list = document.getElementById('list');
const createBtn = document.getElementById('create-btn');

let todos = [];

createBtn.addEventListener('click', createNewTodo);

function createNewTodo() {
    // 새로운 아이템 생성하기
    const item = {
        id: new Date().getTime(),
        text: '',
        complete: false
    }
    // 배열 첫번째 인덱스에 새로운 아이템 추가
    todos.unshift(item);

    // 요소 생성
    const {itemEl, inputEl, editBtnEl, removeBtnEl} = createTodoElement(item);
    
    // 리스트 요소 안에 방금 생성한 아이템 요소 추가
    list.prepend(itemEl);

    // 새로 생성한 목록에 바로 타이핑 할 수 있게 attribute 속성을 disabled 삭제함
    // 타이핑 할 수 있게 만들어주는게 disabled 속성
    inputEl.removeAttribute('disabled');

    // 새로 생성한 목록에 바로 타이핑 할 수 있도록 focus 함
    inputEl.focus();

    // 데이터 값 localStorage에 저장
    saveToLocalStorage();
}

// 이벤트 처리
function createTodoElement(item) {
    // div class로 태그 생성
    // classList는 태그의 이름값이 있는 변수
    const itemEl = document.createElement('div');
    itemEl.classList.add('item');

    // input class로 checkbox 요소 생성
    const checkboxEl = document.createElement('input');
    checkboxEl.type = 'checkbox';
    checkboxEl.checked = item.complete;

    if(item.complete) {
        itemEl.classList.add('complete');
    }

    // input class로 text 입력할 수 있는 요소 생성
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.value = item.text;
    // disabled 속성 : 접근 불가능하게
    inputEl.setAttribute('disabled', '');

    // div class로 action 태그 생성
    const actionsEl = document.createElement('div');
    actionsEl.classList.add('actions');

    // edit button 생성
    const editBtnEl = document.createElement('button');
    editBtnEl.classList.add('material-icons');
    editBtnEl.innerText = 'edit';

    // remove button 생성
    const removeBtnEl = document.createElement('button');
    removeBtnEl.classList.add('material-icons', 'remove-btn');
    removeBtnEl.innerText = 'remove_circles';

    // checkbox가 클릭되면 true -> false, false -> true로 변경하기
    // change 이벤트가 발생함
    checkboxEl.addEventListener('change', () => {
        item.complete = checkboxEl.checked;

        // checkbox가 클릭되면 div class 이름에 complete가 들어가고, 클릭되지 않으면 빠지게
        if(item.complete) {
            itemEl.classList.add('complete');
        }
        else {
            itemEl.classList.remove('complete');
        }

        // 체크박스 상태 localStorage에 저장
        saveToLocalStorage();
    })

    // focus가 되면 disabled가 없었다가, focus가 안되면 disabled 태그가 없어지게 -> blur 이벤트가 발생함
    inputEl.addEventListener('blur', () => {
        inputEl.setAttribute('disabled', '');
        // focus 안되면 localStorage에 저장되게..!!
        saveToLocalStorage();
    })

    // item 변수의 text 속성에 타이핑 한 값 넣어주기
    inputEl.addEventListener('input', () => {
        item.text = inputEl.value;
    })

    // edit 버튼을 클릭하면 타이핑 할 수 있게 만들고, focus 할 수 있게끔
    editBtnEl.addEventListener('click', () => {
        inputEl.removeAttribute('disabled');
        inputEl.focus();
    })

    // remove 버튼을 클릭하면 해당 객체의 데이터 값과 객체 두 가지를 삭제 해야한다
    removeBtnEl.addEventListener('click', () => {
        // 내가 클릭한 item의 id와 다른것만 다시 배열로 반환해준다
        // 즉, 내가 클릭한 객체의 데이터를 없앤것과 같은 효과

        // t.id는 배열을 순회하는 변수, item.id은 내가 클릭한 변수
        todos = todos.filter(t => t.id !== item.id)

        // 클릭한 객체 삭제
        itemEl.remove();

        // remove button 클릭했을 때 데이터 바로 삭제할 수 있게
        saveToLocalStorage();
    })

    // action 태그에 edit, remove 버튼 태그 넣기
    actionsEl.append(editBtnEl);
    actionsEl.append(removeBtnEl);

    // item 태그에 checkbox, input text, action 태그 넣기
    itemEl.append(checkboxEl);
    itemEl.append(inputEl);
    itemEl.append(actionsEl);

    return {itemEl, inputEl, editBtnEl, removeBtnEl}
}

// localStorage에 string 타입으로 저장하는 함수
function saveToLocalStorage() {
    // localStorage에 넣을 때는 항상 string 타입으로 넣어야 하기 때문에 stringify로 변환해서 넣어준다
    const data = JSON.stringify(todos);
    // localStorage에 넣기
    // key-value로 넣기
    window.localStorage.setItem('my_todos', data);
}

// localStorage에 있는 데이터들을 가져오는 함수
function localFromLocalStorage() {
    const data = localStorage.getItem('my_todos');

    if (data) {
        // JSON 타입을 js 객체로 변환해서 todos 변수에 넣어준다
        todos = JSON.parse(data);
    }
}

function displayTodos() {
    // 데이터 보여지게 함수 호출
    localFromLocalStorage();

    for (let i = 0; i < todos.length; i++) {
        const item = todos[i];
        // item만 추출해서 가져옴
        // item 값이 text 값인데 이 부분만 가저오면 요소들이 잘 보임
        const { itemEl } = createTodoElement(item);

        list.append(itemEl);
    }
}

displayTodos();