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
        # Issue: Function is not called when you create and complete a todo in one request.
        # Get the todo that is going to be updated
        original_todo = self.get_object()

        # Perform the save at database level and get the updated object
        updated_todo = serializer.save()

        # Check if completed_date was set in this update
        original_completed_date = original_todo.completed_date
        updated_completed_date = updated_todo.completed_date
        was_todo_completed = bool(updated_completed_date) and not bool(
            original_completed_date)

        # Now, we decide whether to create a recurring todo

        # If completed_date wasn't toggled to have a value in this update,
        # don't create the recurring todo
        if not was_todo_completed:
            print("Todo was not completed")
            return

        # Check if task is recurring, using the value from the NEW todo
        # (in case the user decided not to have a recurring task)
        if updated_todo.frequency is None:
            print("Not a recurring todo")
            return

        # If end_date is set, and today is past the todo's end_date, don't create any more recurring todos
        # if new_todo.end_date and date.today() >= new_todo.end_date:
        #    print("No more todos as end date has past")
        #    return

        # Calculate the new due_date and start_date
        relativedelta_to_add = FREQUENCIES[updated_todo.frequency]
        new_start_date = updated_todo.start_date + relativedelta_to_add
        new_due_date = updated_todo.due_date + \
            relativedelta_to_add if updated_todo.due_date else None

        # If end_date is set, and new_due_date is past the todo's end_date, don't create the recurring todo
        if updated_todo.end_date and new_due_date >= updated_todo.end_date:
            print("No more todos due beyond end_date")
            return

        # Clone the incoming Todo and set due_date, start_date
        # https://docs.djangoproject.com/en/3.2/topics/db/queries/#copying-model-instances
        # new_todo._state.adding = True
        # new_todo.title = old_todo.title
        # new_todo.description = ""
        # new_todo.due_date = new_due_date
        # new_todo.start_date = new_start_date
        # new_todo.completed_date = None

        # If the recurring in progress todo already exists, don't bother creating it
        # We compare the list, frequency, title and completed_date
        if Todo.objects.filter(list=updated_todo.list,
                               frequency=updated_todo.frequency,
                               title=updated_todo.title,
                               completed_date=None
                               ).exists():
            print("In progress todo already exists")
            return
        print("Creating next todo")
        # All the checks have passed, now we create the todo
        next_todo = Todo(
            list=updated_todo.list,
            frequency=updated_todo.frequency,
            title=original_todo.title,
            effort=updated_todo.effort,
            reward=updated_todo.reward,
            start_date=new_start_date,
            due_date=new_due_date
        )
        next_todo.save()


class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    queryset = Wishlist.objects.all()
