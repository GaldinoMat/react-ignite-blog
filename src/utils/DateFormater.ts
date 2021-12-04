import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

export const dateFormater = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy', {
    locale: ptBR,
  });
};
