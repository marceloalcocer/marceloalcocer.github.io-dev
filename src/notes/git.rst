Git 
====

Discard unstaged changes
-------------------------

Discard unstaged changes [#]_::

	git checkout -- .

.. [#] https://stackoverflow.com/questions/52704/how-do-i-discard-unstaged-changes-in-git#answer-52713

Committing
------------

Override configured user for single commit [#]_::

	git -c "user.name=Your Name" -c "user.email=Your email" commit

.. [#] https://stackoverflow.com/questions/19840921/override-configured-user-for-a-single-git-commit


Branching
---------

Merge changes in ``SOURCE`` into ``DEST``::

	git co <DEST>
	git merge <SOURCE>

Rebase changes in ``SOURCE`` on to ``DEST``::

	git co <SOURCE>
	git rebase <DEST>

Displaying
----------------

Show previous file revision [#]_::

	git show <REVISION>:<PATH>

Show all tracked files [#]_::
	
	git ls-tree -r master

.. [#] https://stackoverflow.com/questions/338436/is-there-a-quick-git-command-to-see-an-old-version-of-a-file
.. [#] https://stackoverflow.com/questions/15606955/how-can-i-make-git-show-a-list-of-the-files-that-are-being-tracked
