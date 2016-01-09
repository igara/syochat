/// <reference path="../../typings/tsd.d.ts" />
class Chat {
	constructor() {
		var peer = new Peer({
			// API キー
			key: 'dqdjcwf89deoecdi',
			secure: true
		});
		var connectedPeers = {};

		// peerIdを表示させる
		peer.on('open', function(id:any){
			$('#pid').text(id);
			
		});

		// 他のユーザが接続するのを待機
		peer.on('connection', connect);

		// エラーをキャッチしconsoleログに表示させる
		peer.on('error', function(err:string) {
			console.log(err);
		})

		// チャットに接続されるときの処理
		function connect(c:any) {
			// 
			if (c.label === 'chat') {
				var chatbox = $('<div></div>').addClass('connection').addClass('active').attr('id', c.peer);
				var header = $('<h1></h1>').html('<strong>' + c.peer + '</strong>' + 'がチャットに参加しました!');
				var messages = $('<div><em>接続状態です。</em></div>').addClass('messages');
				chatbox.append(header);
				chatbox.append(messages);

				// チャット
				chatbox.on('click', function() {
					if ($(this).attr('class').indexOf('active') === -1) {
						$(this).addClass('active');
					} else {
						$(this).removeClass('active');
					}
				});

				$('.filler').hide();
				$('#connections').append(chatbox);

				// 
				c.on('data', function(data:any) {
					messages.append('<div><span class="peer">' + c.peer + '</span>: ' + data +
					'</div>');
				});

				c.on('close', function() {
					alert(c.peer + ' は退出されました。 ');
					chatbox.remove();
					if ($('.connection').length === 0) {
						$('.filler').show();
					}
					delete connectedPeers[c.peer];
				});
			} else if (c.label === 'file') {
				c.on('data', function(data:any) {
					// If we're getting a file, create a URL for it.
					if (data.constructor === ArrayBuffer) {
						var dataView = new Uint8Array(data);
						var dataBlob = new Blob([dataView]);
						var url = window.URL.createObjectURL(dataBlob);
						$('#' + c.peer).find('.messages').append('<div><span class="file">' +
							c.peer + ' has sent you a <a target="_blank" href="' + url + '">file</a>.</span></div>');
					}
				});
			}
			connectedPeers[c.peer] = 1;
		}

		$(document).ready(function() {
			// Prepare file drop box.
			var box = $('#box');
			box.on('dragenter', doNothing);
			box.on('dragover', doNothing);
			box.on('drop', function(e:any){
				e.originalEvent.preventDefault();
				var file = e.originalEvent.dataTransfer.files[0];
				eachActiveConnection(function(c:any, $c:any) {
					if (c.label === 'file') {
						c.send(file);
						$c.find('.messages').append('<div><span class="file">ファイルを送信しました。</span></div>');
				}
			});
		});

		function doNothing(e:any){
			e.preventDefault();
			e.stopPropagation();
		}

		// 接続ボタンを押す
		$('#connect').click(function() {
			connecting();
		});

		/**
		 * 接続中
		 */
		function connecting() {
			var requestedPeer = $('#rid').val();
			if (!connectedPeers[requestedPeer]) {

				// Create 2 connections, one labelled chat and another labelled file.
				var c = peer.connect(requestedPeer, {
					label: 'chat',
					serialization: 'none',
					metadata: {message: 'hi i want to chat with you!'}
				});

				//
				c.on('open', function() {
					connect(c);
				});

				// エラーの表示
				c.on('error', function(err:any) {
					alert(err);
				});

				// 
				var f = peer.connect(requestedPeer, {
					label: 'file',
					reliable: true
				});

				//
				f.on('open', function() {
					connect(f);
				});

				//
				f.on('error', function(err:any) {
					alert(err);
				});
			}
			connectedPeers[requestedPeer] = 1;
		}
		
		// 接続切断のボタンを押す
		$('#close').click(function() {
			eachActiveConnection(function(c:any) {
				c.close();
			});
		});
		
		// メッセージ送信のボタンを押す
		$('#send').submit(function(e) {
			e.preventDefault();
			// 入力したメッセージをmsgに入れる
			var msg = $('#text').val();
			eachActiveConnection(function(c:any, $c:any) {
				if (c.label === 'chat') {
					c.send(msg);
					$c.find('.messages').append('<div><span class="you">あなた: </span>' + msg
					+ '</div>');
				}
			});

			// 送信ボタン押下後、テキストボックスを空にする
			$('#text').val('');
			$('#text').focus();
		});
		
		// Goes through each active peer and calls FN on its connections.
		function eachActiveConnection(fn:any) {
			var actives = $('.active');
			var checkedIds = {};
			actives.each(function() {
				var peerId = $(this).attr('id');
		
				if (!checkedIds[peerId]) {
					var conns = peer.connections[peerId];
					for (var i = 0, ii = conns.length; i < ii; i += 1) {
						var conn = conns[i];
						fn(conn, $(this));
					}
				}
		
				checkedIds[peerId] = 1;
			});
		}
		
		// Show browser version
		$('#browsers').text(navigator.userAgent);
		});
		
		// ページを開いたときにpeerの情報を消す
		window.onunload = window.onbeforeunload = function(e:any) {
			if (!!peer && !peer.destroyed) {
				peer.destroy();
			}
		};
	}
}

var chat = new Chat();