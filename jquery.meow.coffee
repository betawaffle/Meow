# jQuery Meow by Zachary Stewart (zacstewart.com)
#
# Copyright (c) 2011 Zachary Stewart
#                    Andrew Hodges (CoffeeScript version)
#
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

every = (time, args..., func) ->
  timer = setInterval func, time, args...
  return stop: ->
    clearInterval timer
    delete @stop
    return

after = (time, args..., func) ->
  timer = setTimeout func, time, args...
  return stop: ->
    clearTimeout timer
    delete @stop
    return

class Meow
  @active = {}
  @create = (msg, opts) ->
    title = opts.title if typeof opts.title is 'string'
    type  = typeof msg
    if type is 'object'
      title or= msg.attr('title')
      type    = msg.get(0).nodeName
    switch type
      when 'string' then break
      when 'INPUT', 'SELECT', 'TEXTAREA'
        msg = msg.attr('value')
      else
        msg = msg.text()
    meow = new Meow msg,
      message_type: type
      trigger     : opts.trigger
      icon        : opts.icon if typeof opts.icon is 'string'
    return @active[meow.timestamp] = meow
  duration: 2400 # 2400 ms = 2.4 seconds
  hovered: false
  constructor: (@message, opts) ->
    @title = opts.title
    @icon  = opts.icon
    @elem  = $('<div/>',
      class: 'meow'
      id   : "meow-#{@timestamp = Date.now()}"
    ).html inner = $('<div/>', class: 'inner').text(@message)
    if typeof @title is 'string'
      inner.prepend $('<h1/>').text(@title)
    if typeof @icon is 'string'
      inner.prepend $('<div/>', class: 'icon').html $('<img/>', src: @icon)
    $('#meows').append @elem.hide().fadeIn(400)
    @elem.bind 'mouseenter mouseleave', (event) =>
      if @hovered = event.type isnt 'mouseleave'
        @elem.removeClass 'hover'
        @destroy() if @timestamp + @duration <= Date.now()
      else
        @elem.addClass 'hover'
    @timer = after @duration, =>
      @destroy() if @hovered isnt true and typeof this is 'object'
      return
  destroy: =>
    @elem.find('.inner').fadeTo 400, 0, =>
      @elem.slideUp =>
        @elem.remove()
        delete Meow.active[@timestamp]
        return
      return
    return

$.fn.meow = (msg, opts) ->
  trigger = opts.trigger ? opts
  if typeof opts isnt 'object' then opts = {}
  create = -> Meow.create msg, opts
  unless typeof trigger isnt 'string'
    @each -> $(this).bind trigger, create
  else
    @each create
