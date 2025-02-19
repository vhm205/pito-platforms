import { Item } from '../domain';
import { OptionsChoicesDto } from '../dto/add-item-to-cart.dto';

export const getChoiceSelected = (rawChoice, optionSelected: any) => {
  const choiceSelected = optionSelected.choices.find(
    (choice: any) => choice.choiceId === rawChoice.choiceId,
  );

  if (!choiceSelected) {
    throw new Error(
      `option ${optionSelected.name} does not have choice with id ${rawChoice.choiceId}`,
    );
  }

  return {
    id: choiceSelected.choiceId,
    name: choiceSelected.name,
    basePrice: choiceSelected.basePrice,
    quantity: rawChoice.quantity,
  };
};

export const getSelectedOptions = (item: Item, optionsChoices: OptionsChoicesDto[] = []) => {
  const itemOptionsAndChoices = item.optionsAndChoices as Array<any>;

  return optionsChoices.map(option => {
    const optionIdSelected = option.optionId;
    const optionSelected = itemOptionsAndChoices.find(
      option => option.optionId === optionIdSelected,
    );

    if (!optionSelected) {
      throw new Error(`${item.name} does not have option with id ${optionIdSelected}`);
    }

    if (optionSelected.isRequired && !option.choices.length) {
      throw new Error(
        `option ${optionSelected.name} is required. You must select at least one choice`,
      );
    }

    const choicesSelected = option.choices.map(rawChoice =>
      getChoiceSelected(rawChoice, optionSelected),
    );
    const totalQuantity = choicesSelected.reduce((acc, choice) => acc + choice.quantity, 0);

    if (optionSelected.isRequired && totalQuantity != optionSelected.maxChoices) {
      throw new Error(
        `option ${optionSelected.name} must have exactly ${optionSelected.maxChoices} choices`,
      );
    }

    return {
      id: optionSelected.optionId,
      name: optionSelected.name,
      description: optionSelected.description,
      choices: choicesSelected,
    };
  });
};

export const calculateTotalPrice = (
  item: Item,
  quantity: number,
  optionsAndChoicesSelected: ReturnType<typeof getSelectedOptions>,
) => {
  if (item.basePrice === null) item.basePrice = 0;

  if (!optionsAndChoicesSelected || !optionsAndChoicesSelected.length) {
    return item.basePrice * quantity;
  }

  const totalPrice = optionsAndChoicesSelected.reduce((acc, option) => {
    const optionPrice = option.choices.reduce(
      (acc, choice) => acc + choice.basePrice * choice.quantity,
      0,
    );
    return acc + optionPrice;
  }, item.basePrice);

  return totalPrice * quantity;
};
