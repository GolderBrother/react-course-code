import { useCallback, useEffect, useRef, useState } from "react";
import './App2.scss';
import { useDrag, useDrop } from "react-dnd";
import classnames from "classnames";

interface CardItem {
    id: number;
    content: string;
}

interface CardProps {
    data: CardItem;
    index: number;
    swapIndex: Function;
}

interface DragData {
    id: number;
    index: number;
}

function Card(props: CardProps) {
    const { data, index: newIndex, swapIndex } = props;
    const ref = useRef<HTMLDivElement | null>(null);
    const [{
        isDragging
    }, drag] = useDrag({
        type: 'card',
        item: {
            id: data.id,
            index: newIndex
        },
        collect(monitor) {
            return {
                isDragging: monitor.isDragging()
            };
        },
    });
    const [, drop] = useDrop({
        accept: 'card',
        // drop(item: DragData) {
        //     console.log('drop', item);
        //     // 在 drop 的时候互换 item.index 和当前 drop 的 newIndex 的 Card
        //     swapIndex(newIndex, item.index);
        // }
        hover(item: DragData) {
            console.log('drop', item);
            // 在 drop 的时候互换 item.index 和当前 drop 的 newIndex 的 Card
            swapIndex(newIndex, item.index);
            item.index = newIndex;
        },
    });
    const cs = classnames('card', {
        'dragging': isDragging
    });
    useEffect(() => {
        drag(ref);
        drop(ref);
    }, [drag, drop]);
    return <div ref={ref} className={cs}>{data.content}</div>
}

function App() {
    const [cardList, setCardList] = useState<CardItem[]>([{
        id: 0,
        content: '000',
    },
    {
        id: 1,
        content: '111',
    },
    {
        id: 2,
        content: '222',
    },
    {
        id: 3,
        content: '333',
    },
    {
        id: 4,
        content: '444',
    }]);
    const swapIndex = useCallback((newIndex: number, oldIndex: number) => {
        [cardList[newIndex], cardList[oldIndex]] = [cardList[oldIndex], cardList[newIndex]];
        setCardList([...cardList]);
    }, [cardList, setCardList]);
    return <div className="card-list">
        {cardList.map((cardItem, index) => <Card key={`id_${cardItem.id}`} data={cardItem} index={index} swapIndex={swapIndex}/>)}
    </div>
}

export default App;