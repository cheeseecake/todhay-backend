from datetime import date

from rest_framework import viewsets

from todos.models import FREQUENCIES, List, Tag, Todo, Wishlist
from todos.serializers import (ListSerializer, TagSerializer, TodoSerializer,
                         WishlistSerializer)


class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()


class ListViewSet(viewsets.ModelViewSet):
    serializer_class = ListSerializer
    queryset = List.objects.all()


class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()

    def perform_update(self, serializer):
        # Get the todo that is going to be updated
        old_todo = self.get_object()

        # Perform the save at database level and get the updated object
        new_todo = serializer.save()

        # Check if completed_date was set in this update
        original_completed_date = old_todo.completed_date
        new_completed_date = new_todo.completed_date
        was_todo_completed = bool(new_completed_date) and not bool(
            original_completed_date)

        # Now, we decide whether to create a recurring todo

        # If completed_date wasn't toggled to have a value in this update,
        # don't create the recurring todo
        if not was_todo_completed:
            return

        # Check if task is recurring, using the value from the NEW todo
        # (in case the user decided not to have a recurring task)
        if new_todo.frequency is None:
            return

        # If end_date is set, and today is past the todo's end_date, don't create any more recurring todos
        if new_todo.end_date and date.today() >= new_todo.end_date:
            return

        # Calculate the new due_date and start_date
        relativedelta_to_add = FREQUENCIES[new_todo.frequency]
        new_start_date = old_todo.start_date + relativedelta_to_add
        new_due_date = new_start_date + relativedelta_to_add

        # If end_date is set, and new_due_date is past the todo's end_date, don't create the recurring todo
        if new_todo.end_date and new_due_date >= new_todo.end_date:
            return

        # Clone the incoming Todo and set due_date, start_date
        # https://docs.djangoproject.com/en/3.2/topics/db/queries/#copying-model-instances
        new_todo.pk = None
        new_todo._state.adding = True
        new_todo.due_date = new_due_date
        new_todo.start_date = new_start_date
        new_todo.completed_date = None

        # If the recurring todo already exists, don't bother creating it
        # We compare the List, title, description, due_date, start_date (that's probably enough)
        if Todo.objects.filter(list=new_todo.list,
                               title=new_todo.title,
                               description=new_todo.description,
                               due_date=new_todo.due_date,
                               start_date=new_todo.start_date,
                               completed_date=new_todo.completed_date).exists():
            return

        # All the checks have passed, now we create the todo
        new_todo.save()


class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    queryset = Wishlist.objects.all()
