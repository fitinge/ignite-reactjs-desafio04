import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

import {iFood} from '../../types';

function Dashboard() {
  const [foods, setFoods] = useState<iFood[]>([])
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<iFood>({} as iFood);

  useEffect(() => {
    async function loadFood() {
      const response = await api.get<iFood[]>('/foods');
      setFoods(response.data);
    }
    loadFood();

  }, []);

  async function handleAddFood(food:iFood){
    try {
      const response = await api.post<iFood>('/foods', {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }
  function handleEditFood(food:iFood){
    setEditingFood(food);
    setEditModalOpen(true);
  }

  async function handleUpdateFood(food:iFood){
    try {
      const foodUpdated = await api.put<iFood>(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );
      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }
  async function handleDeleteFood(id:number){
    await api.delete(`/foods/${id}`);
    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered);
  }

  return (
    <>
         <Header openModal={() => setModalOpen(!modalOpen)} />
         <ModalAddFood
           isOpen={modalOpen}
           setIsOpen={() => setModalOpen(!modalOpen)}
           handleAddFood={handleAddFood}
         />
         <ModalEditFood
           isOpen={editModalOpen}
           setIsOpen={() => setEditModalOpen(!editModalOpen)}
           editingFood={editingFood}
           handleUpdateFood={handleUpdateFood}
         />

         <FoodsContainer data-testid="foods-list">
           {foods &&
             foods.map(food => (
               <Food
                 key={food.id}
                 food={food}
                 handleDelete={handleDeleteFood}
                 handleEditFood={handleEditFood}
               />
             ))}
         </FoodsContainer>
       </>
  )
}

export default Dashboard;
