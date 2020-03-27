import traceback
from copy import deepcopy as clone


def merge(root, *others):
    """Combine a bunch of dictionaries and return the result"""
    cp = clone(root)
    [cp.update(other) for other in others]
    return cp


def exception_to_string(exception):
    """https://stackoverflow.com/questions/4564559/get-exception-description-and-stack-trace-which-caused-an-exception-all-as-a-st/4564595"""
    stack = traceback.extract_stack()[:-3] + traceback.extract_tb(
        exception.__traceback__
    )
    pretty = traceback.format_list(stack)
    return "".join(pretty) + "\n  {} {}".format(exception.__class__, exception)


def nested_get(d, *args, default=None):
    """Helper to access deeply-nested values in dictionaries"""
    for k in args:
        d = d.get(k)
        if not d:
            return default
    return d
